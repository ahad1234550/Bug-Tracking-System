import React from 'react';
import './page.css';
import { ServerStack03Icon, Layers01Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';

export default function Header() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

    return (
        <header>
            <div className="header-left">
                <Link href='/'>
                <img className='logo-img' src="logo.png" alt="Logo" />
                </Link>
                <nav>
                    <Link href="/projects">
                            <HugeiconsIcon icon={ServerStack03Icon} />
                            Projects
                    </Link>

                    <Link href="/bugs">
                            <HugeiconsIcon icon={Layers01Icon} />
                            Bugs
                    </Link>
                </nav>
            </div>

            <div className="header-right">
                <div className="user-container">
                    <img
                        src={`${backendUrl}uploads/1767709568666-Left.png`}
                        alt="UserIcon"
                        width={40}
                        height={40}
                    />
                    <p>Ahad</p>
                </div>
            </div>
        </header>
    );
}
