import MenuProfesor from "@/componentes/menuProfesor";

export default function LayoutProfesor({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <MenuProfesor />

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}