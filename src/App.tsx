import { Table } from "./components/Table/Table";
import { FloatingActions } from "./components/FloatingActions/FloatingActions";
import { Background } from "./components/Background/Background";
import { useBackground } from "./hooks/useBackground";

function App() {
  const { lightLevel, width, startDrag } = useBackground();
  return (
    <div className="relative min-h-screen bg-white p-4 overflow-x-auto z-1">
      <Background width={width} onResize={startDrag} />
      <Table className="relative z-1" lightLevel={lightLevel} />
      <FloatingActions />
    </div>
  );
}

export default App;
