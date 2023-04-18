import TopNav from "./top-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <div className="flex-grow">{children}</div>
      <footer className="bg-gray-800 py-4 text-center text-white">
        <p>Footer</p>
      </footer>
    </div>
  );
}
