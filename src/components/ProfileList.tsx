import React from 'react';

interface Profile {
  id: number;
  email: string;
  role: string;
}

interface ProfileListProps {
  profiles: Profile[];
  onProfileSelect: (profile: Profile) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ profiles, onProfileSelect }) => {
  return (
    <ul>
      {profiles.map((profile) => (
        <li key={profile.id}>
          <button onClick={() => onProfileSelect(profile)}>
            {profile.role} - {profile.email}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ProfileList;
