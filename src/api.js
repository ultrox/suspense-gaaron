/* Title: Demonstration of StepDown Rule by Uncle Bob, implemented by Dan Abramov
   Note: I just added anotations as I reconginzed the pattern, didn't touch the implementation.
*/

// High Level Public Functions (The same Level of Abstraction)
export function fetchRepo(repoId) {
  // calling 2 private methods defined down
  return wrapPromise(getFromGitHub(`/repos/${repoId}`));
}

export function fetchRepoContribs(repoId) {
  return wrapPromise(getFromGitHub(`/repos/${repoId}/contributors`));
}

export function fetchUser(userId) {
  return wrapPromise(getFromGitHub(`/users/${userId}`));
}

export function fetchUserStars(userId) {
  return wrapPromise(getFromGitHub(`/users/${userId}/starred`));
}

export function fetchUserFollowing(userId) {
  return wrapPromise(getFromGitHub(`/users/${userId}/following`));
}

// Lower Level Private Functions

async function getFromGitHub(url) {  
  const response = await fetch('https://api.github.com' + url);
  if (response.status !== 200) {
    throw new Error('GitHub API returned Error ' + response.status);
  }
  return response.json();
}

/*
This is the lowest level of abstraction for this API, that's why is on the bottom.
Notice it dosent call anything from above.
*/
function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    r => {
      status = "success";
      result = r;
    },
    e => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}
