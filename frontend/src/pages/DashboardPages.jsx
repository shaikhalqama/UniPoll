import React, { useState } from 'react';
import { dashboardStyles as s } from '../assets/dummyStyle';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import usePolls from '../hooks/usePolls';
import { Avatar, PollSkeleton } from '../components/UIElements';
import { Compass, PenSquare, Sparkles, User2 } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import PollCard from '../components/PollCard';



const DashboardPages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feed, setFeed] = useState("all");
  const [type, setType] = useState("all");
  const [params] = useSearchParams();
  
  const q = (params.get('q') || "").toLowerCase();

  // Build query string safely
  const qs = new URLSearchParams();
  if (type !== "all") qs.set('type', type);
  if (feed === "following") qs.set('feed', 'following');
  
  const queryString = qs.toString();
  const path = `/polls${queryString ? `?${queryString}` : ''}`;

  // Fetch polls
  const { polls, loading, vote, unvote, bookmark } = usePolls(path);

  // Safely filter and sort (prevents real-world crashes during API delay)
  const shown = (polls || [])
    .filter((p) => p.question?.toLowerCase().includes(q))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className={s.container}>
      <div className={s.greetingRow}>
        <div>
          <h1 className={s.greetingHeading}>
            hey, {user?.name?.split(" ")[0] || "there"} 
          </h1>
          <p className={s.greetingSub}>
            what's the community thinking today?
          </p>
        </div>
      </div>

      <div className={s.composer}>
        <Avatar user={user || {}} className={s.composerAvatar} />
        <button onClick={() => navigate('/create-poll')} className={s.composerInput}>
          Ask the community something...
        </button>
        <button onClick={() => navigate('/create-poll')} className={s.composerButton}>
          <PenSquare size={16} />
        </button>
      </div>

      {/* feed tabs */}
      <div className={s.feedTabs}>
        {[
          ["all", "Explore", Compass],
          ["following", "Following", User2],
        ].map(([k, label, Icon]) => (
          <button 
            key={k} 
            onClick={() => setFeed(k)} 
            className={`${s.tabBase} ${feed === k ? s.tabActive : s.tabInactive}`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>  

      <FilterBar value={type} onChange={setType} />
      {loading ? (
        <PollSkeleton/>
      ): shown.length === 0 ? (
        <div className={s.emptyContainer}>
          <span className={s.emptyIcon}>
            <Sparkles size={22}/>
          </span>
          <p className={s.emptyTitle}>
            {q ? `No result for "${q}"` : feed === "following" ? "Nobody you follow has posted yet" : "Nothing here yet"}
          </p>


          <p className={s.emptyDesc}>
            {feed === "following" ? "Follow Creators to see their polls." : "Be the first to create a poll!"}
          </p>

          <button onClick={() => navigate('/create-poll')} className={s.emptyButton}>
           <PenSquare size={16} /> Create Poll
          </button>
        </div>
      ):(
        shown.map((p) => (
          <PollCard key={p._id} poll={p} vote={vote} unvote={unvote} bookmark={bookmark}/>
        ))
      )}

    </div>
  );
};

export default DashboardPages;