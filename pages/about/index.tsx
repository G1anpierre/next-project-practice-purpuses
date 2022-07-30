import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'

const About = () => {
  const [users, setUsers] = useState<any[]>([])
  const [user, setUser] = useState<any>({})
  const router = useRouter()
  const {userId} = router.query

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(`/api/users`)
      const data = await response.json()
      setUsers(data)
    }
    getUsers()
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      setUser(data.user)
    }
    getUser()
  }, [userId])

  const handleSelection = (id: string) => {
    router.push({pathname: '/about', query: {userId: id}}, undefined, {
      shallow: true,
    })
  }

  const isSelected = (id: any) => {
    return userId === id
  }

  return (
    <>
      <h2>About</h2>
      <div className="container">
        <div>
          <h3>Users</h3>
          <ul className="users-list">
            {users.map(user => (
              <li
                key={user.id}
                className={`user ${Number(userId) === user.id && 'selected'}`}
              >
                <span onClick={() => handleSelection(user.id)}>
                  {user.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Description</h3>
          {user ? (
            <div>
              <p>{user.description}</p>
            </div>
          ) : (
            <p>Choose a users Info</p>
          )}
        </div>
      </div>
      <style jsx>{`
        .users-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .user:hover {
          color: orange;
          text-decoration: underline;
        }

        .selected {
          color: red;
        }

        @media screen and (min-width: 768px) {
          .container {
            display: grid;
            gap: 24px;
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </>
  )
}

export default About

// export const getStaticProps = async () => {

// }
