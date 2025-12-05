import { useContext } from "react";
import UserSiteBarManager from "../components/userSiteBarManager";
import { MyContext } from "../App";

const AccountLayout = ({ title, subtitle, children }) => {
  const context = useContext(MyContext);
  return (
    <div className="py-10 w-full">
      <div className="container flex gap-5">
        {context?.windowWidth > 475 && <UserSiteBarManager />}
        <div className="w-[100%] sm:w-[75%] bg-white shadow-md rounded-sm p-4">
          {(title || subtitle) && (
            <div className="mb-4">
              {title && <h2 className="text-xl font-bold mb-1">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
