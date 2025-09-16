function calculateAge(icnumber) {
  const birthYearLastTwoDigits = parseInt(icnumber.slice(0, 2), 10);
  const birthMonth = parseInt(icnumber.slice(2, 4), 10) - 1; 
  const birthDay = parseInt(icnumber.slice(4, 6), 10);


  const currentYear = new Date().getFullYear();
  const currentYearLastTwoDigits = currentYear % 100;

  let birthYear;
  if (birthYearLastTwoDigits > currentYearLastTwoDigits) {
    birthYear = 1900 + birthYearLastTwoDigits;
  } else {
    birthYear = 2000 + birthYearLastTwoDigits;
  }

  const birthDate = new Date(birthYear, birthMonth, birthDay);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}
export default calculateAge;