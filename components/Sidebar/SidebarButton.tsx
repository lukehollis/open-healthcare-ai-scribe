import { FC } from 'react';

interface Props {
  text: string;
  icon: JSX.Element;
  onClick: () => void;
  featured?: boolean,
}

export const SidebarButton: FC<Props> = ({ text, icon, onClick, featured }) => {
  return (
    <button
      className={`flex text-left w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 transition-colors duration-200 ${featured ? 'bg-gray-800 dark:bg-white dark:text-neutral-800 text-neutral-200 dark:hover:bg-gray-300 hover:bg-gray-500' : 'text-neutral-800 dark:text-white hover:bg-gray-500/10 dark:hover:bg-gray-500/10'} `}
      onClick={onClick}
    >
      <div>{icon}</div>
      <span>{text}</span>
    </button>
  );
};
