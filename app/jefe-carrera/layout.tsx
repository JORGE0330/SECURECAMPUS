import MenuJefeCarrera from "@/componentes/menuJefeCarrera";

export default function LayoutJefeCarrera({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-gray-100">

      <MenuJefeCarrera />

      <div className="flex-1">
        {children}
      </div>

    </div>
  );
}