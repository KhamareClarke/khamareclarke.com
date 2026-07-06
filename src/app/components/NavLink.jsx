import Link from "next/link";

const NavLink = ({ href, title, active }) => {
  return (
    <a
      href={href}
      className={`block py-2 pl-3 pr-4 sm:text-xl rounded md:p-0 transition-colors duration-200 ${active ? 'text-[#ffb700] font-bold' : 'text-[#ADB7BE] hover:text-[#ffb700]'}`}
      aria-current={active ? 'page' : undefined}
      style={{scrollBehavior:'smooth'}}
    >
      {title}
    </a>
  );
};

export default NavLink;
