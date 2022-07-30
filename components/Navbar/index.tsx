import React from 'react'
import styles from './Navbar.module.css'
import Link from 'next/link'

export const Navbar = () => {
  return (
    <nav className={styles.container}>
      <ul className={styles.navElements}>
        <li>
          <Link href="/characters">
            <a>Characters</a>
          </Link>
        </li>
        <li>
          <Link href="/locations">
            <a>Locations</a>
          </Link>
        </li>
        <li>
          <Link href="/episodes">
            <a>Episode</a>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <a>About</a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
