import './styles.css';

export interface ErrorFallbackProps {
  error: Error;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div id="errorFallback">
      <div className="alert">
        <p>
          <strong>Opps!</strong> An unexpected error occurred!
        </p>
      </div>
      <div className="errorlinks">
        <p>Back to Home?</p>
        <p>
          <a className="errorlink" href="/">
            Yes
          </a>
          <a
            className="errorlink"
            href="https://www.youtube.com/watch?v=M230r6CLZUA"
          >
            No
          </a>
        </p>
      </div>
      <hr />
      <div>
        <a id="hide1" href="#hide1" className="hide">
          Show Full Error Message
        </a>
        <a id="show1" href="#show1" className="show">
          Hide Full Error Message
        </a>
        <table className="fullErrorMessage">
          <caption> Full Error Message</caption>
          <tbody>
            <tr>
              <th>Name</th>
              <td>{error.name}</td>
            </tr>
            <tr>
              <th>Message</th>
              <td>{error.message}</td>
            </tr>
            <tr>
              <th>Stack</th>
              <td>{error.stack}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
