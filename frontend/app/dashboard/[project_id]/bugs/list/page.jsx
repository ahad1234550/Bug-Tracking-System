import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React from 'react'
import "./page.css"
export default function List() {
  return (
    <div className='table-container'>
      <table>
        <thead>
          <tr>
            <th>BUG DETAILS</th>
            <th>STATUS</th>
            <th>DUE DATE</th>
            <th>ASSIGNED TO</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Convert the audio file received from Mobile app into text</td>
            <td>
              <span className='status pending'>Pending</span>
            </td>

            <td>13/02/23</td>
            <td><Image
              src="/user.png"
              width={20}
              height={20}
              alt="user-avatar"
              className="avatar"
            /></td>
            <td><FontAwesomeIcon icon={faEllipsisVertical} className="fa-icon" />
            </td>
          </tr>
          <tr>
            <td>Convert the audio file received from Mobile app into text</td>
            <td>
              <span className='status pending'>Pending</span>
            </td>

            <td>13/02/23</td>
            <td><Image
              src="/user.png"
              width={20}
              height={20}
              alt="user-avatar"
              className="avatar"
            /></td>
            <td><FontAwesomeIcon icon={faEllipsisVertical} className="fa-icon" />
            </td>
          </tr>
          <tr>
            <td>Convert the audio file received from Mobile app into text</td>
            <td>
              <span className='status pending'>Pending</span>
            </td>

            <td>13/02/23</td>
            <td><Image
              src="/user.png"
              width={20}
              height={20}
              alt="user-avatar"
              className="avatar"
            /></td>
            <td><FontAwesomeIcon icon={faEllipsisVertical} className="fa-icon" />
            </td>
          </tr>
          <tr>
            <td>Convert the audio file received from Mobile app into text</td>
            <td>
              <span className='status pending'>Pending</span>
            </td>

            <td>13/02/23</td>
            <td><Image
              src="/user.png"
              width={20}
              height={20}
              alt="user-avatar"
              className="avatar"
            /></td>
            <td><FontAwesomeIcon icon={faEllipsisVertical} className="fa-icon" />
            </td>
          </tr>
          <tr>
            <td>Convert the audio file received from Mobile app into text</td>
            <td>
              <span className='status pending'>Pending</span>
            </td>

            <td>13/02/23</td>
            <td><Image
              src="/user.png"
              width={20}
              height={20}
              alt="user-avatar"
              className="avatar"
            /></td>
            <td><FontAwesomeIcon icon={faEllipsisVertical} className="fa-icon" />
            </td>
          </tr>
          <tr>
            <td>Convert the audio file received from Mobile app into text</td>
            <td>
              <span className='status pending'>Pending</span>
            </td>

            <td>13/02/23</td>
            <td><Image
              src="/user.png"
              width={20}
              height={20}
              alt="user-avatar"
              className="avatar"
            /></td>
            <td><FontAwesomeIcon icon={faEllipsisVertical} className="fa-icon" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
