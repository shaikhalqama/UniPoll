import User from '../models/User.js';
import Poll from '../models/Poll.js';
import Comment from '../models/Comment.js';
import {notify} from './notificationController.js';

// to vote on a poll
export const votePoll = async (req, res) => {
    try {
      const poll = await Poll.findById(req.params.id);
      if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
      if(poll.closed){
        return res.status(400).json({ message: 'Poll is closed' });
      }

      const {value} = req.body;
      if(value === undefined || value === null || value === ''){
        return res.status(400).json({ message: 'Vote value is required' });
      }
    
      // for a user can vote on a poll one time only
      const hadVote = poll.votes.some((v) => String(v.user) === String(req.userId));
      poll.votes = poll.votes.filter((v) => String(v.user) !== String(req.userId));
      poll.votes.push({user: req.userId, value});

      await poll.save();
      if(!hadVote) await notify({user: poll.creator, actor: req.userId, poll: poll._id, type: "vote" })
      res.json({message: "Vote submitted successfully"})

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// remove your vote (undo)
export const removeVote = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
      if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
      if(poll.closed){
        return res.status(400).json({ message: 'Poll is closed' });
      }
 
      poll.votes = poll.votes.filter((v) => String(v.user) !== String(req.userId));
      await poll.save();
      res.json({message: "Vote removed successfully"})


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// 