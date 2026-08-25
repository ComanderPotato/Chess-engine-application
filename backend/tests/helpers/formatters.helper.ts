const DOMAIN_NAMES = ["gmail", "hotmail", "outlook", "test"];
const TOP_LEVEL_DOMAIN = [".com", ".com.au", ".org", ".edu"];
export function formatValidUsername(
  firstName: string,
  lastName: string,
): string {
  firstName = firstName.replaceAll(" ", "");
  lastName = lastName.replaceAll(" ", "");

  const usernameLength = firstName.length + lastName.length;
  let username = firstName.concat(lastName);

  for (let i = usernameLength; i < 10; i++) {
    username += String(i - usernameLength + 1);
  }
  return username;
}
export function formatValidEmail(firstName: string, lastName: string): string {
  firstName = firstName.replaceAll(" ", "");
  lastName = lastName.replaceAll(" ", "");

  const randomDomain =
    DOMAIN_NAMES[Math.floor(Math.random() * DOMAIN_NAMES.length)];
  const randomTopLevelDomain =
    TOP_LEVEL_DOMAIN[Math.floor(Math.random() * DOMAIN_NAMES.length)];
  return `${firstName}.${lastName}@${randomDomain}${randomTopLevelDomain}`;
}

export function formatInvalidEmail(
  firstName: string,
  lastName: string,
): string {
  firstName = firstName.replaceAll(" ", "");
  lastName = lastName.replaceAll(" ", "");

  const emptyPart = Math.floor(Math.random() * 3);
  const username = emptyPart === 0 ? "" : `${firstName}.${lastName}`;
  const randomDomain =
    emptyPart === 1
      ? ""
      : DOMAIN_NAMES[Math.floor(Math.random() * DOMAIN_NAMES.length)];
  const randomTopLevelDomain =
    emptyPart === 2
      ? ""
      : TOP_LEVEL_DOMAIN[Math.floor(Math.random() * DOMAIN_NAMES.length)];

  return `${username}@${randomDomain}${randomTopLevelDomain}`;
}
