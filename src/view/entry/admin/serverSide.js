import serverSideFactory from '../serverSideFactory';
import RouteDefinition from './routeDefinition';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

export default serverSideFactory(RouteDefinition, 'admin', lightBaseTheme);
