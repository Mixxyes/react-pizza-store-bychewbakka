import ContentLoader from 'react-content-loader';

const Skeleton: React.FC<{ childKey: number }> = ({ childKey }) => (
  <ContentLoader
    className="pizza-block"
    speed={2}
    width={280}
    height={480}
    viewBox="0 0 280 480"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    key={childKey}>
    <circle cx="135" cy="135" r="125" />
    <rect x="0" y="278" rx="10" ry="10" width="280" height="25" />
    <rect x="0" y="436" rx="10" ry="10" width="95" height="30" />
    <rect x="0" y="326" rx="10" ry="10" width="280" height="90" />
    <rect x="130" y="430" rx="25" ry="25" width="150" height="45" />
  </ContentLoader>
);

export { Skeleton };
