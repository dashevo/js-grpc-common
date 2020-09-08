const GrpcError = require('../../../../lib/server/error/GrpcError');

describe('GrpcError', () => {
  let code;
  let message;
  let metadata;
  let error;

  beforeEach(() => {
    code = 1;
    message = 'Message';
    metadata = {};

    error = new GrpcError(code, message, metadata);
  });

  describe('#getMessage', () => {
    it('should return message', () => {
      const result = error.getMessage();

      expect(result).to.equal(message);
    });
  });

  describe('#getCode', () => {
    it('should return code', () => {
      const result = error.getCode();

      expect(result).to.equal(code);
    });
  });

  describe('#getMetadata', () => {
    it('should return metadata', () => {
      const result = error.getMetadata();

      expect(result).to.equal(metadata);
    });
  });

  describe('#setMessage', () => {
    it('should set message', async () => {
      metadata = {
        stack: 'stack info',
      };

      error.setMetadata(metadata);

      expect(error.getMetadata()).to.deep.equal(metadata);
    });
  });

  describe('#setMetadata', () => {
    it('should set metadata', async () => {
      message = 'error message';
      error.setMessage(message);

      expect(error.getMessage()).to.equal(message);
    });
  });
});
