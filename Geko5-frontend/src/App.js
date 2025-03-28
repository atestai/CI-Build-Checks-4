import {  createTheme, ThemeProvider } from '@mui/material';
import Dashboard from './components/dashboards';
import SignIn from './views/SignIn';

import { jwtDecode } from 'jwt-decode';

function App() {

	const validateToken = (token) => {
		if (!token) return false;
	
		try {
			const decoded = jwtDecode(token);
	
			// Controlla se il token è scaduto
			const currentTime = Math.floor(Date.now() / 1000); // In secondi
			if (decoded.exp && decoded.exp < currentTime) {
				console.warn("Token scaduto");
				return false;
			}
	
			return true; // Token valido
		} catch (error) {
			console.error("Token invalido:", error);
			return false;
		}
	};

	const browserTheme = 'light';

	const appTheme = createTheme({

		palette: {
			mode: `${browserTheme}`,

			primary: {
				main: '#007CB0', //#07AEE6
				contrastText: '#fff',
				text: '#007CB0', //#009688
				textIntoButton: '#FFF',
				light: '#7CD5F3',
				dark: '#007CB0',
				menuBackground: '#E5F8FE',
			},
			secondary: {
				main: '#F19C00',
				contrastText: '#fff',
				text: '#000',
				text2: '#707070'
			},
			chip: {
				chipAllBg: '#000000DE',
				chipAllTxt: '#fff',
				chipEnableBgActive: '#009688',
				chipEnabledBg: '#0096881A',
				chipEnabledTxtActive: '#fff',
				chipEnabledTxtNotActive: '#009688',
				chipDisableBgActive: '#FF00031A',
				chipDisableBg: '#FF0003',
				chipDisableTxtActive: '#fff',
				chipDisableTxtNotActive: '#FF0000',
				text: '#000',
				text2: '#707070'

			},
			editMode : {
				bg : "#007CB0",
				colorIcon : '#fff'
			},
			exportMode : {
				bg: "#54C51C",
				colorIcon : '#fff'
			}
			,
			buttonImport: {
				bg: '#009688',
				icon: 'white'
			},
			buttonExport: {
				bg: '#007CB0',
				icon: 'white'
			},
			tertiary: {
				text: "#B4B4B4"
			},
			component: {
				colorSecondary: '#FAFAFA'
			}


		},

		breakpoints: {
			values: {
				xs: 0,
				sm: 600,
				md: 900,
				lg: 1200,
				xl: 1536,
				xxl: 1920,
			},
		},

		/*
		typography: {
			fontFamily: 'Poppins, sans-serif',
		},


		overrides: {
			MuiCssBaseline: {
				'@global': {
					'@font-face': [Poppins], // Define the font family
				},
			},
			*
		},

		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						borderRadius: '20px', // Imposta il border-radius per tutti i pulsanti
					},
				},
			},
		},
		*/
	});


	//sessionStorage.setItem('user', 3);

	const token = sessionStorage.getItem('token');
    const isValidToken = validateToken(token);

	return (
		<ThemeProvider theme={appTheme}>
			{isValidToken ? <Dashboard/> : <SignIn />}
		</ThemeProvider>
	);
}

export default App;
