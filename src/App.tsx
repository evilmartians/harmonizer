import { Table } from "./components/Table/Table";
import { FloatingActions } from "./components/FloatingActions/FloatingActions";
import { Background } from "./components/Background/Background";

function App() {
  return (
    <div className="relative min-h-screen bg-white p-4 overflow-x-auto z-1">
      <Background level={4} />
      <Table className="relative z-1" />
      <FloatingActions />
    </div>
  );
}

export default App;
