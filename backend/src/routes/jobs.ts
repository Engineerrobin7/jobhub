import { Router } from 'express';
import JobModel from '@/models/Job';
import { ValidationError, NotFoundError } from '@/utils/errors';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      location,
      remote,
      type,
      company,
      salaryMin,
      salaryMax,
      tags,
      postedAfter,
      limit,
      offset,
      sortBy,
      sortOrder,
    } = req.query as any;

    const filters: any = {};
    if (search) filters.search = String(search);
    if (location) filters.location = String(location);
    if (remote !== undefined) filters.remote = String(remote) === 'true';
    if (type) filters.type = String(type).split(',');
    if (company) filters.company = String(company).split(',');
    if (salaryMin) filters.salaryMin = parseInt(String(salaryMin), 10);
    if (salaryMax) filters.salaryMax = parseInt(String(salaryMax), 10);
    if (tags) filters.tags = String(tags).split(',');
    if (postedAfter) filters.postedAfter = new Date(String(postedAfter));
    if (limit) filters.limit = parseInt(String(limit), 10);
    if (offset) filters.offset = parseInt(String(offset), 10);
    if (sortBy) filters.sortBy = String(sortBy);
    if (sortOrder) filters.sortOrder = String(sortOrder);

    const result = await JobModel.findWithFilters(filters);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (!job) throw new NotFoundError('Job not found');
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/similar', async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 5;
    const jobs = await JobModel.searchSimilarJobs(req.params.id, limit);
    res.json({ success: true, data: jobs });
  } catch (err) {
    next(err);
  }
});

router.get('/stats', async (_req, res, next) => {
  try {
    const stats = await JobModel.getJobStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
});

export default router;


