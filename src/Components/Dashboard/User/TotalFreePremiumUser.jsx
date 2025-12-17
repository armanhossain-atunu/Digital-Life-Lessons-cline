import React from 'react';
import useUsers from '../../../Hooks/ShareAllApi/useUsers';

const TotalFreePremiumUser = () => {
  const { data: users = [], isLoading, error } = useUsers();

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Failed to load users</p>;

  // Premium count (plan === 'premium')
  const premiumTotal = users.filter(user => user.plan?.toLowerCase() === 'premium').length;

  // Free count (plan === 'free' বা plan না থাকলে)
  const freeTotal = users.filter(user => !user.plan || user.plan?.toLowerCase() === 'free').length;

  console.log(premiumTotal, freeTotal);

  return (
    <div >
      {/* Summary */}
      <div className=" flex gap-6">
        <div className='bg-blue-100 text-blue-800 text-center shadow-lg rounded-2xl p-8'>
          <h1>Premium Users</h1>
          <h1 className='text-2xl text-center font-semibold'>{premiumTotal}</h1>
        </div>

        <div className="bg-purple-100 text-center shadow-lg rounded-2xl p-8">
          <h1>
            Free Users
          </h1>
          <h1 className='text-2xl text-center font-semibold'>
            {freeTotal}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default TotalFreePremiumUser;
