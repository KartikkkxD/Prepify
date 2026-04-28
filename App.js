import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlanProvider } from './src/context/PlanContext';
import HomeScreen from './src/screens/HomeScreen';
import CreateScheduleScreen from './src/screens/CreateScheduleScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import PlanScreen from './src/screens/PlanScreen';
import FocusModeScreen from './src/screens/FocusModeScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import BacklogModeScreen from './src/screens/BacklogModeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PlanProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FFF6E9' },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateSchedule" component={CreateScheduleScreen} />
          <Stack.Screen name="Review" component={ReviewScreen} />
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Plan" component={PlanScreen} />
          <Stack.Screen name="FocusMode" component={FocusModeScreen} />
          <Stack.Screen name="Insights" component={InsightsScreen} />
          <Stack.Screen name="BacklogMode" component={BacklogModeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PlanProvider>
  );
}
