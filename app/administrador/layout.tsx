import MenuAdministrador from "@/componentes/menuAdministrador";

export default function AdministradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <MenuAdministrador />

      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}