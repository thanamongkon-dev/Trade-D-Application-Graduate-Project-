import React from 'react'

import AppNavigator from "./src/routers/AppNavigator";
import { AuthProvider } from './src/hooks/AuthContext';
import { MenuProvider } from 'react-native-popup-menu';

const App = () => {
	console.disableYellowBox = true;
	console.disableRedBox = true;
	return (
		<MenuProvider>
			<AuthProvider>
				<AppNavigator/>
			</AuthProvider>
		</MenuProvider>
	);
};

export default App