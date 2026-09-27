import { getAvatarHue, getInitial } from '@/utils/format';

interface AvatarProps {
  username: string;
  size?: 'sm' | 'md';
}

export const Avatar = ({ username, size = 'sm' }: AvatarProps) => (
  <span
    className={`avatar avatar-${size}`}
    style={{ '--avatar-hue': getAvatarHue(username) } as React.CSSProperties}
    aria-hidden="true"
  >
    {getInitial(username)}
  </span>
);
