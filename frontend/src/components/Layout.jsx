import React, { useState } from 'react'
import { layoutStyles as s } from '../assets/dummyStyle';
import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { Bookmark, CheckCircle2, LayoutGrid, LogOut, PenLine, Plus, PlusSquare, Search, Settings, Sidebar, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRef } from 'react';
import useClickOutside from '../hooks/useClickOutside';
import NotificationBell from './NotificationBell';
import SideBar from './Sidebar'; 
import { Avatar } from './UIElements';


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
                             <div ref={userRef} className={s.avatarWrapper}>
                                <Avatar user={user || {}} className={s.avatarClass}/>
                             </div>
                    </div>
                </div>

                {/* mobile expanded search */}
                {mobileSearch && (
                    <div className={s.mobileSearchContainer}>
                        <div className={s.mobileSearchInner}>
                            <Search size={14} className={s.searchIcon} />
                            <input autoFocus value={q} onChange={(e) =>
                                navigate(`/dashboard?q=${encodeURIComponent(e.target.value)}` ,
                                {replace: true})
                            } placeholder='Search polls'
                            className={s.mobileSearchInput}/>
                        </div>
                    </div>
                )}
            </header>
            {/* body*/}
            <div className={s.bodyContainer}>
               <aside className={s.leftSidebar}>
                <p className={s.menuLabel}> Menu </p>
                <nav className={s.navContainer}>
                  {NAV.map(({to, label, Icon})=> (
                    <NavLink key={to} to={to} className={({isActive}) => 
                      `${s.sideLinkBase} ${isActive ? s.sideLinkActive : s.sideLinkInactive}`
                    }>
                      <Icon size={16} className='shrink-0'/>
                      {label}
                    </NavLink>
                  ))}
                </nav>
                <div className={s.sidebarBottom}>
                    <NavLink to='/settings' className={({isActive}) => 
                      `${s.sideLinkBase} ${isActive ? s.sideLinkActive : s.sideLinkInactive}`}
                      >
                        <Settings size={16} className='shrink-0'/>
                        Settings
                    </NavLink>
                    <button onClick={() => { logout();
                        navigate('/login');
                    }} className={s.logoutButton}>
                        <LogOut size={16} className='shrink-0'/> Log out
                    </button>
                </div>
               </aside>
               {/* main content */}
               <main className={s.mainContent}>
                 <Outlet />
               </main>
               
               <aside className={s.rightRail}>
                 <SideBar />
               </aside>
            </div>

           <nav className={s.bottomNav}>
            {NAV.map(({to, label, Icon}) => (
              <NavLink key={to} to={to} className={({isActive}) => 
                `${s.sideLinkBase} ${isActive ? s.bottomLinkActive : s.bottomLinkInactive}`
              }>
                <Icon size={20} />
                <span>
                  {label.split(" ")[0]}
                </span>
              </NavLink>
            ))}
            </nav>

        </div>
    )
}

export default Layout;