// jest.mock('react-router-dom', () => {
//   // Require the original module to not be mocked...
//   const originalModule = jest.requireActual('react-router-dom');
//
//   return {
//     __esModule: true,
//     ...originalModule,
//     useParams: jest.fn(),
//     useHistory: jest.fn(),
//     useNavigate: jest.fn(),
//   };
// });

jest.mock('translations/translate', () => ({
  t: (key) => key
}))
