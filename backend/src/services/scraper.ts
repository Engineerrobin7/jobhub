import puppeteer from 'puppeteer';
import { scrapingConfig } from '@/config';
import { logger } from '@/utils/logger';
import { ScrapedJob } from '@/types';
import JobModel from '@/models/Job';
import { setCache, getCache } from '@/utils/redis';

export class JobScraper {
  private browser: puppeteer.Browser | null = null;

  async initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
        ],
      });
      logger.info('Puppeteer browser initialized');
    } catch (error) {
      logger.error('Failed to initialize Puppeteer browser:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.info('Puppeteer browser closed');
    }
  }

  async scrapeJobs(source: {
    name: string;
    website: string;
    careerPage: string;
    selectors: any;
  }): Promise<ScrapedJob[]> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const page = await this.browser.newPage();
    const jobs: ScrapedJob[] = [];

    try {
      // Set user agent
      await page.setUserAgent(scrapingConfig.userAgent);

      // Navigate to career page
      logger.info(`Scraping jobs from ${source.name}: ${source.careerPage}`);
      await page.goto(source.careerPage, {
        waitUntil: 'networkidle2',
        timeout: scrapingConfig.timeout,
      });

      // Wait for job listings to load
      await page.waitForSelector(source.selectors.jobList, { timeout: 10000 });

      // Extract job listings
      const jobElements = await page.$$(source.selectors.jobList);

      for (const element of jobElements) {
        try {
          const job = await this.extractJobData(element, source);
          if (job) {
            jobs.push(job);
          }
        } catch (error) {
          logger.error(`Error extracting job data from ${source.name}:`, error);
        }
      }

      logger.info(`Successfully scraped ${jobs.length} jobs from ${source.name}`);

    } catch (error) {
      logger.error(`Failed to scrape jobs from ${source.name}:`, error);
    } finally {
      await page.close();
    }

    return jobs;
  }

  private async extractJobData(element: puppeteer.ElementHandle, source: any): Promise<ScrapedJob | null> {
    try {
      const title = await element.$eval(source.selectors.jobTitle, (el) => el.textContent?.trim());
      const company = source.name;
      const location = await element.$eval(source.selectors.location, (el) => el.textContent?.trim());
      const description = await element.$eval(source.selectors.description, (el) => el.textContent?.trim());
      const applyUrl = await element.$eval(source.selectors.jobLink, (el) => el.getAttribute('href'));
      const salary = source.selectors.salary ? await element.$eval(source.selectors.salary, (el) => el.textContent?.trim()) : undefined;
      const postedDate = source.selectors.postedDate ? await element.$eval(source.selectors.postedDate, (el) => el.textContent?.trim()) : undefined;

      if (!title || !location || !description || !applyUrl) {
        return null;
      }

      // Normalize apply URL
      const normalizedApplyUrl = applyUrl.startsWith('http') ? applyUrl : `${source.website}${applyUrl}`;

      return {
        title,
        company,
        location,
        description,
        applyUrl: normalizedApplyUrl,
        salary,
        postedDate,
        tags: this.extractTags(title, description),
      };
    } catch (error) {
      logger.error('Error extracting job data:', error);
      return null;
    }
  }

  private extractTags(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase();
    const commonTags = [
      'javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'python', 'java', 'c#', 'php',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'sql', 'mongodb', 'redis', 'git', 'agile',
      'scrum', 'devops', 'frontend', 'backend', 'fullstack', 'mobile', 'ios', 'android', 'flutter',
      'react native', 'machine learning', 'ai', 'data science', 'blockchain', 'cybersecurity',
      'remote', 'hybrid', 'onsite', 'senior', 'junior', 'lead', 'manager', 'architect'
    ];

    return commonTags.filter(tag => text.includes(tag));
  }

  async saveJobs(jobs: ScrapedJob[], source: string): Promise<number> {
    let savedCount = 0;

    for (const jobData of jobs) {
      try {
        // Check if job already exists
        const existingJob = await JobModel.findByApplyUrl(jobData.applyUrl);
        if (existingJob) {
          continue;
        }

        // Create new job
        const job = await JobModel.create({
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          type: this.determineJobType(jobData.title, jobData.description),
          remote: this.isRemoteJob(jobData.title, jobData.description, jobData.location),
          salary: this.parseSalary(jobData.salary),
          description: jobData.description,
          requirements: [],
          benefits: [],
          tags: jobData.tags,
          applyUrl: jobData.applyUrl,
          sourceUrl: jobData.applyUrl,
          source,
          postedDate: this.parseDate(jobData.postedDate),
          isActive: true,
        });

        savedCount++;
        logger.debug(`Saved job: ${job.title} at ${job.company}`);
      } catch (error) {
        logger.error('Error saving job:', error);
      }
    }

    return savedCount;
  }

  private determineJobType(title: string, description: string): 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance' {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('intern') || text.includes('internship')) return 'internship';
    if (text.includes('part-time') || text.includes('part time')) return 'part-time';
    if (text.includes('contract') || text.includes('freelance')) return 'contract';
    if (text.includes('freelance')) return 'freelance';
    
    return 'full-time';
  }

  private isRemoteJob(title: string, description: string, location: string): boolean {
    const text = `${title} ${description} ${location}`.toLowerCase();
    return text.includes('remote') || text.includes('work from home') || text.includes('wfh');
  }

  private parseSalary(salaryText?: string): { min: number; max: number; currency: string } | undefined {
    if (!salaryText) return undefined;

    // Simple salary parsing - can be enhanced
    const numbers = salaryText.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      const min = parseInt(numbers[0]);
      const max = parseInt(numbers[1]);
      return { min, max, currency: 'USD' };
    }

    return undefined;
  }

  private parseDate(dateText?: string): Date {
    if (!dateText) return new Date();

    // Simple date parsing - can be enhanced
    const date = new Date(dateText);
    return isNaN(date.getTime()) ? new Date() : date;
  }
}

// Scraping scheduler
export const startScrapingScheduler = (): void => {
  const scraper = new JobScraper();
  
  // Run scraping every 6 hours
  setInterval(async () => {
    try {
      await scraper.initialize();
      
      // Example scraping sources (these would come from database in production)
      const sources = [
        {
          name: 'Example Company',
          website: 'https://example.com',
          careerPage: 'https://example.com/careers',
          selectors: {
            jobList: '.job-listing',
            jobTitle: '.job-title',
            jobLink: '.job-link',
            companyName: '.company-name',
            location: '.location',
            description: '.description',
            salary: '.salary',
            postedDate: '.posted-date',
          },
        },
      ];

      for (const source of sources) {
        try {
          const jobs = await scraper.scrapeJobs(source);
          const savedCount = await scraper.saveJobs(jobs, source.name);
          logger.info(`Scraped and saved ${savedCount} jobs from ${source.name}`);
        } catch (error) {
          logger.error(`Failed to scrape ${source.name}:`, error);
        }
      }

      await scraper.close();
    } catch (error) {
      logger.error('Scraping scheduler error:', error);
    }
  }, 6 * 60 * 60 * 1000); // 6 hours

  logger.info('Scraping scheduler started');
};

export default JobScraper;
