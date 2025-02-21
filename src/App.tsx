import { Background } from "./components/Background/Background";
import { FloatingActions } from "./components/FloatingActions/FloatingActions";
import { Table } from "./components/Table/Table";

function App() {
  return (
    <div className="relative min-h-screen px-6 py-4 overflow-x-auto z-1">
      <Background />
      <Table className="relative z-1 mb-10" />
      <FloatingActions />
    </div>
  );
}

export default App;
