import MenuLateral from "@/componentes/menuLateral";

export default function LayoutEstudiante({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-gray-100">

      <MenuLateral />

      <div className="flex-1">
        {children}
      </div>

    </div>
  );
}