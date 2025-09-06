const icons = {
  dashboard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-dashboard"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 13m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M13.45 11.55l2.05 -2.05"></path>
      <path d="M6.4 20a9 9 0 1 1 11.2 0z"></path>
    </svg>
  ),
  wallet: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-wallet2"
      viewBox="0 0 16 16"
      strokeWidth=".5"
      stroke="currentColor"
    >
      <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
    </svg>
  ),
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  role: [1, 2, 3, 4],
  children: [
    {
      id: "/dashboard",
      title: "Dashboard",
      type: "item",
      url: "/dashboard",
      icon: icons.dashboard,
      role: [1, 2, 3, 4],
      breadcrumbs: false,
    },
    // {
    //   id: "/wallet",
    //   title: "Wallet",
    //   type: "item",
    //   url: "/wallet",
    //   icon: icons.wallet,
    //   role: [1],
    //   breadcrumbs: false,
    // },
  ],
};

export default dashboard;
