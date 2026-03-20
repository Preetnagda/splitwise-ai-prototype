interface MemberAvatarProps {
  name: string;
  isYou?: boolean;
}

export function MemberAvatar({ name, isYou }: MemberAvatarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 shrink-0">
        {name[0]}
      </div>
      <span className="text-sm font-medium text-gray-700">
        {isYou ? "You" : name}
      </span>
    </div>
  );
}
