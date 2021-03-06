const GrpcErrorCodes = require('../../../../lib/server/error/GrpcErrorCodes');
const InternalGrpcError = require('../../../../lib/server/error/InternalGrpcError');

describe('InternalGrpcError', () => {
  let error;
  let internalError;

  beforeEach(() => {
    error = new Error();

    internalError = new InternalGrpcError(error);
  });

  describe('#getError', () => {
    it('should return error', () => {
      const result = internalError.getError();

      expect(result).to.equal(error);
    });
  });

  describe('#getCode', () => {
    it('should return INTERNAL error code', () => {
      const result = internalError.getCode();

      expect(result).to.equal(GrpcErrorCodes.INTERNAL);
    });
  });
});
