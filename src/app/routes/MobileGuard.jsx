import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function MobileGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (isMobile && location.pathname === "/sales") {
      navigate("/cash", { replace: true });
    }
  }, [location.pathname, isMobile, navigate]);

  return null;
}

export default MobileGuard;