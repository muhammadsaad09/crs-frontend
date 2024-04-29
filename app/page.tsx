import Home from "@/components/Home";

const Header = () => {
  return (
    <nav className="text-[#57606f] bg-[#dfe4ea] px-12 py-6 font-medium text-[19px]">
      <ul>
        <li>Home</li>
      </ul>
    </nav>
  );
};

// box-shadow:
export default function Page() {
  return <Home />;
}
