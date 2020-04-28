export const logCommand = async (cmdObj: any) => {
  console.log(process.env.BUILD_VERSION);
  process.exit();
};
