import api from "../utils/api";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";




export default function usePolls(path){
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const {refresh} = useAuth();

    const toast = useToast();

    const load = useCallback(async () =>{
        setLoading(true);
        try {
            const {data} = await api.get(path);
            setPolls(data);
        } finally{
            setLoading(false);
        }
    }, [path]);
   
    useEffect(() => {
        load();
    }, [load]);

    // to  replace the polls with other polls
    const replace = (p) =>
        setPolls((arr) => arr.map((x) => (x._id === p._id ? p : x)));

    // to vote on a poll or change your vote
    const vote = async (id, value) => {
        const wasVoted  =  polls.find((p) => p._id === id)?. myVote != null;
        await api.post(`/polls/${id}/vote`,{value});

        const {data} = await api.get(`/polls/${id}?noview=true`); // refetch to get results
        replace(data);
        toast(wasVoted ? "Vote Changed" : "Vote recorded");
        refresh();
    };

    // to remove  your vote
    const unvote = async (id) => {
        try{
        await api.delete(`/polls/${id}/vote`);
        const {data} = await api.get(`/polls/${id}?noview=true`); // refetch to get results
        replace(data);
        toast("Vote removed");
        refresh();
        } catch (error) {
            toast(error.response?.data?.message || "Failed to remove vote");
        }
    }
    
    // to bookmark a poll
    const bookmark = async (id) => {
        
        await api.post(`/polls/${id}/bookmark`);
        const {data} = await api.get(`/polls/${id}?noview=true`); // refetch to get results

        setPolls((arr) => arr.map((x) => x._id === id ? (
            {...x,
            isBookmarked: !x.isBookmarked,
            saves : (x.saves || 0) + (x.isBookmarked ? -1 : 1)
            }
        ) : x));

        toast(data.bookmarked ? "Saved" : "Removed from saved");
        refresh();
       
    }
    
    // to edit a poll
    const edit = async (id, payload) => {
       await api.patch(`/polls/${id}`, payload); 
       const {data} = await api.get(`/polls/${id}?noview=true`);
       replace(data);
       toast("Poll updated");
    }

    // to close or re-open the poll
    const close = async (id) => {
        const {data} = await api.patch(`/polls/${id}/close`);
        setPolls((arr) => arr.map((x) => x._id === id ? (
            {...x,
            closed: data.close
            }
        ) : x));
        toast(data.close ? "Poll closed" : "Poll reopened");  
    };

    const remove = async(id) => {
        await api.get(`/polls/${id}`);
         setPolls((arr) => arr.filter((x) => x._id !== id));
         toast("Poll deleted");
         refresh();
    };

    return {
        polls,
         loading, 
         vote, 
         unvote, 
         bookmark, 
         edit, 
         close, 
         remove
        };
}
