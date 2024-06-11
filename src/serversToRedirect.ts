export class AvaliableServers {
  private currentServerIndex = 0;
  private avaliableServers: string[] = [];
  private offlineServers: string[] = [];

  constructor(allServers: string[]) {
    this.avaliableServers = allServers;
  }

  next() {
    const target = this.avaliableServers[this.currentServerIndex];
    this.currentServerIndex =
      (this.currentServerIndex + 1) % this.avaliableServers.length;
    return target;
  }
}
