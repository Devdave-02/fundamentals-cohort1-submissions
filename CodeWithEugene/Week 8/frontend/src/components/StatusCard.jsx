import PropTypes from 'prop-types';

const StatusCard = ({
  title,
  status,
  description,
  children,
  footer = undefined,
  actions = []
}) => {
  return (
    <section className="card">
      <header className="card__header">
        <div>
          <h2 className="card__title">{title}</h2>
          {description ? <p className="card__description">{description}</p> : null}
        </div>
        {status ? <span className={`badge badge--${status.toLowerCase()}`}>{status}</span> : null}
      </header>
      <div className="card__body">{children}</div>
      {(footer || actions?.length) && (
        <footer className="card__footer">
          <div>{footer}</div>
          <div className="card__actions">
            {actions?.map((action) => (
              <button
                key={action.label}
                type="button"
                className="button"
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        </footer>
      )}
    </section>
  );
};

StatusCard.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func
    })
  )
};

export default StatusCard;
