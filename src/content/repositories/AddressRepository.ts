export default interface AddressRepository {
  getCurrentURL(): URL;
}

export class AddressRepositoryImpl implements AddressRepository {
  getCurrentURL(): URL {
    return new URL(window.location.href);
  }
}
