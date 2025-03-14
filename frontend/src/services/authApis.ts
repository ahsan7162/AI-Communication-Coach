import apiService from "../config/api-service";

export const signUp = async (email: string, password: string) => {
  try {
    const response = await apiService.post("/api/signup", {
      name: email,
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error fetching chats", error);
  }
};

export const login = async (identifier: string, password: string) => {
  try {
    const response = await apiService.post("/api/login", {
      identifier,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error fetching chats", error);
  }
};
