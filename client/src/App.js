import './App.css';
import HomePage from './components/HomePage';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import Discover from './components/Discover';
import Thanks from './components/Thanks';
import Editor from './components/Editor';
import { v4 } from 'uuid';

function App() {
	return (
		<div className='App'>
			<Router>
				<Switch>
					<Route path='/' exact component={HomePage} />
					<Route path='/thanks' exact component={Thanks} />
					<Route path='/discover' exact component={Discover} />
					<Route path='/documents' exact>
						<Redirect to={`/documents/${v4()}`} />
					</Route>
					<Route path='/documents/:id' component={Editor} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
