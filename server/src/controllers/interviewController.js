import Interview from '../models/Interview.js';
import Candidate from '../models/Candidate.js';

export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate('recruitment', 'candidate_name position status')
      .sort({ scheduled_at: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInterview = async (req, res) => {
  try {
    const { recruitment_id, scheduled_at, meeting_link } = req.body;
    
    const interview = new Interview({
      recruitment: recruitment_id,
      scheduled_at,
      meeting_link
    });

    const createdInterview = await interview.save();
    
    // Update candidate status to 'interview' automatically if scheduled
    await Candidate.findByIdAndUpdate(recruitment_id, { status: 'interview' });

    res.status(201).json(createdInterview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
