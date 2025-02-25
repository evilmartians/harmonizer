import { Background } from "./components/Background/Background";
import { FloatingActions } from "./components/FloatingActions/FloatingActions";
import { Table } from "./components/Table/Table";

function App() {
  return (
    <div className="relative z-1 min-h-screen overflow-x-auto px-6 py-4">
      <Background />
      <Table className="relative z-1 mb-10" />
      <FloatingActions />
    </div>
  );
}

export default App;
