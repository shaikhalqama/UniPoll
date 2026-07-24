import React from 'react'
import { layoutStyles as s } from '../assets/dummyStyle';
import { NavLink } from 'react-router-dom';
import { Bookmark, CheckCircle2, LayoutGrid, PenLine, PlusSquare, Search } from 'lucide-react';

const NAV = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutGrid },
  { to: "/create-poll", label: "Create", Icon: PlusSquare },
  { to: "/my-polls", label: "My Polls", Icon: PenLine },
  { to: "/voted-polls", label: "Voted", Icon: CheckCircle2 },
  { to: "/bookmarked-polls", label: "Saved", Icon: Bookmark },
];

const Layout = () => {
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
                    </div>

                </div>
            </header>
        </div>
    )
}

export default Layout