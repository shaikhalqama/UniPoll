import React, { useState } from 'react'
import { layoutStyles as s } from '../assets/dummyStyle';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Bookmark, CheckCircle2, LayoutGrid, PenLine, Plus, PlusSquare, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRef } from 'react';
import useClickOutside from '../hooks/useClickOutside';
import NotificationBell from './NotificationBell';


const NAV = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutGrid },
  { to: "/create-poll", label: "Create", Icon: PlusSquare },
  { to: "/my-polls", label: "My Polls", Icon: PenLine },
  { to: "/voted-polls", label: "Voted", Icon: CheckCircle2 },
  { to: "/bookmarked-polls", label: "Saved", Icon: Bookmark },
];

const Layout = () => {

    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [userOpen, setUserOpen] = useState(false);
    const [mobileSearch, setMobileSearch] = useState(false);
    const q = searchParams.get('q') || "";

    const userRef = useRef(null);

    useClickOutside(userRef, () => {
        setUserOpen(false);
        console.log(userOpen);
    });

    return (
        <div className={s.container}>
            <header className={s.header}>
                <div className={s.headerInner}>
                    <NavLink to='/dashboard' className={s.logoLink}>
                        <img src="/favicon.svg" alt="logo" className={s.logoImg} />
                        <span className={s.logoSpan}>UniPoll</span>
                    </NavLink>

                    <div className={s.searchDesktop}>
                        <Search size={14} className={s.searchIcon} />
                        <input value = {q} onChange={(e) =>
                            navigate(`/dashboard?q=${encodeURIComponent(e.target.value)}` ,
                            {replace: true})
                        } 
                        placeholder='Search polls'
                        className={s.searchInput}
                        />
                    </div>
                    {/* right cluster */}
                    <div className={s.rightCluster}>
                        <button onClick={() => setMobileSearch((v) => !v)}
                            className={s.mobileSearchToggle}> {mobileSearch ? 
                            <X size={17} /> : <Search size={17} />}
                            </button>

                            <NavLink to='/create-poll' className={s.createButton}>
                                <Plus size={15} /> Create
                            </NavLink>

                            {/* notification bell */}
                            <NotificationBell />

                             {/* avatar */}
                             
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Layout;