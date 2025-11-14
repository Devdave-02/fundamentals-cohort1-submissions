import PropTypes from 'prop-types';

const MetricTile = ({ label, value, accent = 'primary' }) => {
  return (
    <div className={`metric metric--${accent}`}>
      <dt className="metric__label">{label}</dt>
      <dd className="metric__value">{value}</dd>
    </div>
  );
};

MetricTile.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  accent: PropTypes.oneOf(['primary', 'success', 'warning', 'danger'])
};

export default MetricTile;
