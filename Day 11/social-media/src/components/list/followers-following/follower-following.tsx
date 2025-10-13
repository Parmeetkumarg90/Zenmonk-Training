import { follow_following_view_Interface } from '@/interfaces/follower-following-list'
import React from 'react'

const FollowerFollowing = ({ data, loading }: { data: follow_following_view_Interface | null, loading: boolean }) => {
    return (
        <>
            {loading ? "Loading  " : <div>List: {JSON.stringify(data)}</div>}
        </>
    )
}

export default FollowerFollowing