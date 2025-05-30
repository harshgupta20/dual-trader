import React from 'react';

const ProfileCard = ({ userInfo, onLogout, accountNo }) => {
    const {
        full_name,
        email,
        user_type,
        user_shortname,
        avatar_url,
        login_time,
        products,
        exchanges,
    } = userInfo;

    const formattedLoginTime = login_time
        ? new Date(login_time).toLocaleString()
        : 'N/A';

    const renderAvatar = () => {
        if (avatar_url) {
            return (
                <img
                    src={avatar_url}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
            );
        } else {
            return (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-gray-600 border-2 border-gray-300">
                    {full_name?.[0]?.toUpperCase() || '?'}
                </div>
            );
        }
    };

    return (
        <div className="relative max-w-sm w-full bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
            {/* Logout Button */}
            <button
                onClick={onLogout}
                className="absolute top-2 right-3 text-sm text-red-500 hover:text-red-700 font-semibold"
            >
                Logout
            </button>

            {/* Avatar */}
            <div className="flex justify-center mb-4">{renderAvatar()}</div>

            {/* User Info */}
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">{full_name}</h2>
                <p className="text-sm text-gray-500">{email}</p>
                <span className="inline-block mt-2 text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {user_type}
                </span>
            </div>

            {/* Additional Info */}
            <div className="mt-4 text-sm text-gray-700 space-y-1">
                <div>
                    <span className="font-medium">Shortname:</span> {user_shortname}
                </div>
                <div>
                    <span className="font-medium">Login Time:</span> {formattedLoginTime}
                </div>
                <div className='flex justify-center'>
                    <span className="inline-block mt-2 text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {accountNo}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
