import TankStatusTable from '../components/TankStatusTable';
import ConsumptionStatistics from '../components/ConsumptionStatistics';

function Dashboard() {
  return (
    <div>
      <ConsumptionStatistics />
      <TankStatusTable />
      {/* Otros componentes del dashboard */}
    </div>
  );
}

export default Dashboard;
